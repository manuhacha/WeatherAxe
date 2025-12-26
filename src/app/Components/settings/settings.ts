import { Component } from '@angular/core';
import { Header } from "../Reusable/header/header";
import { Footer } from "../Reusable/footer/footer";

@Component({
  selector: 'app-settings',
  imports: [Header, Footer],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

}
