// step4.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { FormDataService } from '../../services/form-data.service';

interface SelectedPlan {
  name: string;
  price: number;
  isYearly: boolean;
}

interface SelectedAddon {
  name: string;
  price: number;
}

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, RouterLink, NavigationButtonsComponent],
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css']
})
export class Step4Component implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  private readonly router: Router;
  private readonly formDataService: FormDataService;

  selectedPlan: SelectedPlan = {
    name: 'Arcade',
    price: 9,
    isYearly: false
  };

  selectedAddons: SelectedAddon[] = [];

  constructor(
    router: Router,
    formDataService: FormDataService
  ) {
    this.router = router;
    this.formDataService = formDataService;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.formDataService.formData$.subscribe(data => {
        // Load plan data
        this.selectedPlan = {
          name: data.plan.type.charAt(0).toUpperCase() + data.plan.type.slice(1),
          price: data.plan.price,
          isYearly: data.plan.isYearly
        };

        // Load addons
        this.selectedAddons = data.addons;
      })
    );
  }

  get totalPrice(): number {
    const planPrice = this.selectedPlan?.price ?? 0;
    const addonsTotal = this.selectedAddons?.reduce(
      (sum, addon) => sum + (addon?.price ?? 0),
      0
    );
    return planPrice + addonsTotal;
  }

  get formattedTotalPrice(): string {
    return this.totalPrice.toFixed(2);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/multi-step/step3']);
  }

  confirmSubscription(): void {
    this.formDataService.clearStorage();
    this.router.navigate(['/multi-step/step5']);
  }
}