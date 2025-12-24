import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-settings',
  imports: [Header, Footer],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

}
