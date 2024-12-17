// step2.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { FormService } from '../../services/form-data.service';

type PlanType = '' | 'arcade' | 'advanced' | 'pro';

interface Plan {
  id: PlanType;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: string;
}

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, RouterLink, NavigationButtonsComponent],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit, OnDestroy {
  selectedPlan: Plan['id'] = 'arcade';
  isYearly = false;
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
  ];

  constructor(
    private readonly formService: FormService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadSavedPlan();
  }

  private loadSavedPlan(): void {
    this.subscription.add(
      this.formService.getPlan().subscribe(plan => {
        if (plan.type) {
          this.selectedPlan = plan.type as Plan['id'];
          this.isYearly = plan.isYearly;
        }
      })
    );
  }

  private updatePlanData(): void {
    const selectedPlanDetails = this.plans.find(plan => plan.id === this.selectedPlan);
    if (!selectedPlanDetails) {
      console.error(`Invalid plan selected: ${this.selectedPlan}`);
      return;
    }

    this.formService.updatePlan({
      type: this.selectedPlan,
      isYearly: this.isYearly,
      price: this.isYearly ? selectedPlanDetails.yearlyPrice : selectedPlanDetails.monthlyPrice
    });
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}