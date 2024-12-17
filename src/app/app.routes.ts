// app.routes.ts
import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MultiStepComponent } from './multi-step/multi-step.component';
import { Step1Component } from './components/step1/step1.component';
import { Step2Component } from './components/step2/step2.component';
import { Step3Component } from './components/step3/step3.component';
import { Step4Component } from './components/step4/step4.component';
import { Step5Component } from './components/step5/step5.component';
import { MobileNavigationGuard } from './guard/mobile-navigation-guard.service';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'multi-step',
    component: MultiStepComponent,
    children: [
      { path: '', redirectTo: 'step1', pathMatch: 'full' },
      { path: 'step1', component: Step1Component },
      {
        path: 'step2',
        component: Step2Component,
        canActivate: [MobileNavigationGuard]
      },
      {
        path: 'step3',
        component: Step3Component,
        canActivate: [MobileNavigationGuard]
      },
      {
        path: 'step4',
        component: Step4Component,
        canActivate: [MobileNavigationGuard]
      },
      {
        path: 'step5',
        component: Step5Component,
        canActivate: [MobileNavigationGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];