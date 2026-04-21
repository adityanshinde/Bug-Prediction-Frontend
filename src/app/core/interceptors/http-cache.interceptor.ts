import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

interface CacheEntry {
  expiry: number;
  response: HttpResponse<unknown>;
}

const CACHE_TTL_MS = 30_000;
const responseCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Observable<HttpEvent<unknown>>>();

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Cache only GET requests. Mutations clear cache to avoid stale reads.
  if (req.method !== 'GET') {
    responseCache.clear();
    inFlight.clear();
    return next(req);
  }

  const key = req.urlWithParams;
  const now = Date.now();
  const cached = responseCache.get(key);

  if (cached && cached.expiry > now) {
    return of(cached.response.clone());
  }

  const pending = inFlight.get(key);
  if (pending) {
    return pending;
  }

  const request$ = next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        responseCache.set(key, {
          expiry: Date.now() + CACHE_TTL_MS,
          response: event.clone()
        });
      }
    }),
    finalize(() => inFlight.delete(key)),
    shareReplay(1)
  );

  inFlight.set(key, request$);
  return request$;
};

