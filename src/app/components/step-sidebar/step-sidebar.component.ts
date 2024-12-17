// step-sidebar.component.ts
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Step {
  number: number;
  title: string;
  label: string;
}

@Component({
  selector: 'app-step-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styleUrls: ['../../multi-step/multi-step.component.css'],
  template: `
   <nav class="multi-step__sidebar" aria-label="Multi-step navigation">
    <ul class="multi-step__nav-list">
      @for (step of steps; track step.number) {
        <li class="multi-step__nav-item">
          <a
            [routerLink]="getStepLink(step)"
            routerLinkActive="multi-step__nav-link--active"
            [routerLinkActiveOptions]="{exact: true}"
            class="multi-step__nav-link"
            [class.multi-step__nav-link--disabled]="isStepDisabled(step.number)"
            [attr.aria-current]="isStepActive(step.number) ? 'step' : null"
            [attr.aria-disabled]="isStepDisabled(step.number)"
          >
            <span class="multi-step__step-number"
                  [class.multi-step__step-number--active]="isStepActive(step.number)">
              {{step.number}}
            </span>
            <div class="multi-step__step-info">
              <span class="multi-step__step-label">{{step.title}}</span>
              <span class="multi-step__step-title">{{step.label}}</span>
            </div>
          </a>
        </li>
      }
    </ul>
  </nav>
  `
})
export class StepSidebarComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep = 1;
  @Input() isMobile = false;

  isStepActive(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }

  isStepDisabled(stepNumber: number): boolean {
    return this.isMobile && stepNumber !== this.currentStep;
  }

  getStepLink(step: Step): string[] | null {
    if (this.isStepDisabled(step.number)) {
      return null;
    }
    return ['step' + step.number];
  }
}