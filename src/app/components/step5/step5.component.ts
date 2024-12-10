// step5.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// step5.component.ts
@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css']
})
export class Step5Component implements OnDestroy {
  private timeoutId?: number;

  constructor(private readonly router: Router) {}

  // ngOnInit(): void {
  //   this.timeoutId = window.setTimeout(() => {
  //     this.router.navigate(['/']);
  //   }, 3000);
  // }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}