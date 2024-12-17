import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { selectPlan, selectAddons } from '../../store/form/form.selectors';
import { FormActions } from '../../store/form/form.actions';

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
  selectedPlan: SelectedPlan = {
    name: 'Arcade',
    price: 9,
    isYearly: false
  };

  selectedAddons: SelectedAddon[] = [];

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select(selectPlan).subscribe(plan => {
        if (plan.type) {
          this.selectedPlan = {
            name: plan.type.charAt(0).toUpperCase() + plan.type.slice(1),
            price: plan.price,
            isYearly: plan.isYearly
          };
        }
      })
    );

    this.subscription.add(
      this.store.select(selectAddons).subscribe(addons => {
        this.selectedAddons = addons.map(addon => ({
          name: addon.name,
          price: addon.price
        }));
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
    this.store.dispatch(FormActions.resetForm());
    this.router.navigate(['/multi-step/step5']);
  }
}