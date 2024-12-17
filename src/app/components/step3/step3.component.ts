// step3.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationButtonsComponent } from '../navigation-buttons/navigation-buttons.component';
import { FormService } from '../../services/form-data.service';

interface Addon {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  selected: boolean;
}

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationButtonsComponent],
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
})
export class Step3Component implements OnInit, OnDestroy {
  isYearly = false;
  private readonly subscription = new Subscription();
  addons: Addon[] = [
    {
      id: 'online',
      name: 'Online service',
      description: 'Access to multiplayer games',
      monthlyPrice: 1,
      yearlyPrice: 10,
      selected: false,
    },
    {
      id: 'storage',
      name: 'Larger storage',
      description: 'Extra 1TB of cloud save',
      monthlyPrice: 2,
      yearlyPrice: 20,
      selected: false,
    },
    {
      id: 'profile',
      name: 'Customizable profile',
      description: 'Custom theme on your profile',
      monthlyPrice: 2,
      yearlyPrice: 20,
      selected: false,
    },
  ];

  constructor(
    private readonly formService: FormService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.formService.getPlan().subscribe((plan) => {
        this.isYearly = plan.isYearly;
      })
    );

    this.subscription.add(
      this.formService.getAddons().subscribe((savedAddons) => {
        if (savedAddons.length) {
          this.addons = this.addons.map((addon) => ({
            ...addon,
            selected: savedAddons.some((saved: { id: string; }) => saved.id === addon.id),
          }));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get selectedAddons(): Addon[] {
    return this.addons.filter((addon) => addon.selected);
  }

  toggleAddon(addon: Addon): void {
    addon.selected = !addon.selected;
    this.updateAddons();
  }

  private updateAddons(): void {
    const selectedAddons = this.selectedAddons.map((addon) => ({
      id: addon.id,
      name: addon.name,
      price: this.isYearly ? addon.yearlyPrice : addon.monthlyPrice,
      selected: addon.selected,
    }));

    this.formService.updateAddons(selectedAddons);
  }

  goBack(): void {
    this.router.navigate(['/multi-step/step2']);
  }

  goNext(): void {
    this.updateAddons();
    this.router.navigate(['/multi-step/step4']);
    this.updateAddons();
    this.router.navigate(['/multi-step/step4']);
  }
}
