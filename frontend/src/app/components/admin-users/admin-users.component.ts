import { Component, OnInit } from '@angular/core';
import { UsersService, AdminUser } from '../../services/users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = false;
  error = '';
  success = '';

  name = '';
  email = '';
  password = '';
  role: 'ADMIN' | 'AGENT' = 'AGENT';

  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.usersService.findAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
      },
    });
  }

  createUser(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.usersService
      .create({
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      })
      .subscribe({
        next: (user) => {
          this.users.push(user);
          this.loading = false;
          this.success = "Utilisateur créé.";
          this.name = '';
          this.email = '';
          this.password = '';
          this.role = 'AGENT';
        },
        error: () => {
          this.loading = false;
          this.error = "Erreur lors de la création de l'utilisateur.";
        },
      });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Supprimer l'utilisateur ${user.email} ?`)) {
      return;
    }
    this.usersService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== user.id);
      },
      error: () => {
        this.error = "Erreur lors de la suppression de l'utilisateur.";
      },
    });
  }
}
