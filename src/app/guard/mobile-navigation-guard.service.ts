import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FormService } from '../services/form-data.service';

@Injectable({
  providedIn: 'root'
})
export class MobileNavigationGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly formService: FormService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isMobile = window.innerWidth < 768;
    const targetStep = parseInt(route.url[0].path.replace('step', ''), 10);
    const currentStep = this.getCurrentStep();

    if (isMobile && targetStep !== currentStep && targetStep !== currentStep + 1) {
      return false;
    }

    return true;
  }

  private getCurrentStep(): number {
    const currentUrl = this.router.url;
    const stepMatch = RegExp(/step(\d+)/).exec(currentUrl);
    return stepMatch ? parseInt(stepMatch[1], 10) : 1;
  }
}