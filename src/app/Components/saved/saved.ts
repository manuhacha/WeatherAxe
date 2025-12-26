import { Component } from '@angular/core';
import { Header } from "../Reusable/header/header";
import { Footer } from "../Reusable/footer/footer";

@Component({
  selector: 'app-saved',
  imports: [Header, Footer],
  templateUrl: './saved.html',
  styleUrl: './saved.css',
})
export class Saved {

}
