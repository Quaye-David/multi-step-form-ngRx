// multi-step.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { StepSidebarComponent } from '../components/step-sidebar/step-sidebar.component';
import { FormDataService } from '../services/form-data.service';

@Component({
  selector: 'app-multi-step',
  standalone: true,
  imports: [RouterOutlet, StepSidebarComponent],
  templateUrl: './multi-step.component.html',
  styleUrls: ['./multi-step.component.css'],
})
export class MultiStepComponent implements OnDestroy {
  currentStep = 1;
  isMobile = window.innerWidth < 768;
  isThankYouPage = false;
  private readonly subscription = new Subscription();

  steps = [
    { number: 1, title: 'Your Info', label: 'Step 1' },
    { number: 2, title: 'Select Plan', label: 'Step 2' },
    { number: 3, title: 'Add-ons', label: 'Step 3' },
    { number: 4, title: 'Summary', label: 'Step 4' },
  ];

  constructor(
    private readonly router: Router,
    private readonly FormDataService: FormDataService
  ) {
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          const currentUrl = this.router.url;
          this.isThankYouPage = currentUrl.includes('step5');
          const stepMatch = RegExp(/step(\d+)/).exec(currentUrl);
          if (stepMatch) {
            this.currentStep = parseInt(stepMatch[1], 10);
          }
        })
    );
  }

  async handleClose(): Promise<void> {
    this.FormDataService.clearStorage();
    await this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
