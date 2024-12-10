// navigation-buttons.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface ButtonConfig {
  type: 'back' | 'next' | 'confirm';
  label: string;
  cssClass: string;
  showIf: boolean;
  disabled?: boolean;
  emit: () => void;
}

@Component({
  selector: 'app-navigation-buttons',
  standalone: true,
  styleUrls: ['../../multi-step/multi-step.component.css'],
  template: `
    <div class="multi-step__buttons">
      @for (button of getVisibleButtons(); track button.type) {
        <button
          [class]="'multi-step__button ' + button.cssClass"
          [disabled]="button.disabled"
          (click)="button.emit()"
        >
          {{ button.label }}
        </button>
      }
    </div>
  `
})
export class NavigationButtonsComponent {
  @Input() showBackButton = false;
  @Input() showNextButton = false;
  @Input() showConfirmButton = false;
  @Input() isNextDisabled = false;

  @Output() onBack = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  private getButtonConfigs(): ButtonConfig[] {
    return [
      {
        type: 'back',
        label: 'Go Back',
        cssClass: 'multi-step__button--back',
        showIf: this.showBackButton,
        emit: () => this.onBack.emit()
      },
      {
        type: 'next',
        label: 'Next Step',
        cssClass: 'multi-step__button--next',
        showIf: this.showNextButton,
        emit: () => this.onNext.emit()
      },
      {
        type: 'confirm',
        label: 'Confirm',
        cssClass: 'multi-step__button--confirm',
        showIf: this.showConfirmButton,
        disabled: this.isNextDisabled,
        emit: () => this.onConfirm.emit()
      }
    ];
  }

  protected getVisibleButtons(): ButtonConfig[] {
    return this.getButtonConfigs().filter(btn => btn.showIf);
  }
}