import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgClass, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  //Declaramos nuestro booleano en false, para cambiar según se clicka en el icono del menú hamburguesa
  isMenuOpen: Boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
