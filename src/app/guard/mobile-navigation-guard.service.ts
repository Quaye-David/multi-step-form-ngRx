import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MobileNavigationGuard implements CanActivate {
  private readonly MOBILE_BREAKPOINT = 376;

  constructor(private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Only apply guard for sidebar navigation
    if (!state.url.includes('multi-step')) {
      return true;
    }

    const isMobile = window.innerWidth <= this.MOBILE_BREAKPOINT;
    const targetStep = parseInt(route.url[0].path.replace('step', ''), 10);
    const currentStep = this.getCurrentStep();

    // Allow normal navigation through form buttons
    if (targetStep === currentStep + 1) {
      return true;
    }

    // Block sidebar navigation on mobile
    if (isMobile) {
      return false;
    }

    // On desktop, only allow backward navigation through sidebar
    return targetStep < currentStep;
  }

  private getCurrentStep(): number {
    const currentUrl = this.router.url;
    const stepMatch = RegExp(/step(\d+)/).exec(currentUrl);
    return stepMatch ? parseInt(stepMatch[1], 10) : 1;
  }
}