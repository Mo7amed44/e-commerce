import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
  }
}
