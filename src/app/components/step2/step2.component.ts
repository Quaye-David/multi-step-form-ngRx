
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationButtonsComponent } from "../navigation-buttons/navigation-buttons.component";
import { FormDataService } from '../../services/form-data.service';

type PlanType = '' | 'arcade' | 'advanced' | 'pro';
interface Plan {
  id: PlanType;  // Update from string to PlanType
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: string;
}

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, NavigationButtonsComponent],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component implements OnInit, OnDestroy {
  selectedPlan: Plan['id'] = 'arcade'; // Default fallback
  isYearly = false;
  private readonly router: Router;
  private readonly formDataService: FormDataService;
  private readonly subscription = new Subscription();

  plans: Plan[] = [
    {
      id: 'arcade',
      title: 'Arcade',
      monthlyPrice: 9,
      yearlyPrice: 90,
      icon: 'assets/images/icon-arcade.svg'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      monthlyPrice: 12,
      yearlyPrice: 120,
      icon: 'assets/images/icon-advanced.svg'
    },
    {
      id: 'pro',
      title: 'Pro',
      monthlyPrice: 15,
      yearlyPrice: 150,
      icon: 'assets/images/icon-pro.svg'
    }
  ] as const;

  constructor(
    router: Router,
    formDataService: FormDataService
  ) {
    this.router = router;
    this.formDataService = formDataService;
  }

  ngOnInit(): void {
    // Load saved data
    this.subscription.add(
      this.formDataService.formData$.subscribe(data => {
        if (data.plan.type) {
          this.selectedPlan = data.plan.type as Plan['id'];
          this.isYearly = data.plan.isYearly;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updatePlanData(): void {
    const selectedPlanDetails = this.plans.find(plan => plan.id === this.selectedPlan);
    if (!selectedPlanDetails) {
      console.error(`Invalid plan selected: ${this.selectedPlan}`);
      return;
    }

    try {
      this.formDataService.updatePlan({
        type: this.selectedPlan,
        isYearly: this.isYearly,
        price: this.isYearly ? selectedPlanDetails.yearlyPrice : selectedPlanDetails.monthlyPrice
      });
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  }

  toggleBilling(): void {
    this.isYearly = !this.isYearly;
    this.updatePlanData();
  }

  selectPlan(planId: PlanType): void {
    this.selectedPlan = planId;
    this.updatePlanData();
  }

  goBack(): void {
    this.router.navigate(['/multi-step/step1']);
  }

  goNext(): void {
    if (this.selectedPlan) {
      this.updatePlanData();
      this.router.navigate(['/multi-step/step3']);
    }
  }
}