import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'operations/shift-completion/:routeId/:shiftId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
