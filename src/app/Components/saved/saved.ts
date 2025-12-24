import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-saved',
  imports: [Header, Footer],
  templateUrl: './saved.html',
  styleUrl: './saved.css',
})
export class Saved {

}
