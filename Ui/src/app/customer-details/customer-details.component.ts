import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
declare var bootstrap: any;

@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
    customers: any[] = [];
    addForm!: FormGroup;
    editForm!: FormGroup;    
  selectedCustomer!: any;
    private apiUrl = 'http://localhost:7275/api/Customer'; 
  userRole: string;

    constructor(private http: HttpClient,private fb : FormBuilder,private authService : AuthService) {
      this.userRole=localStorage.getItem('role') ;
    }

    ngOnInit() {
        this.loadCustomers();
        this.editForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
          });

          this.addForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            passwordHash: ['', [Validators.required]],
            role: ['', [Validators.required]]
          });
    }

    loadCustomers() {
        this.http.get(this.apiUrl).subscribe(data => {
            this.customers = data as any[];
        });
    }

    openEditModal(customer: any) {
        debugger;
        this.selectedCustomer = customer;
        this.editForm.patchValue(customer);
    
        const modal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
        modal.show();
      }
    
      closeEditModal() {
        const modalElement = document.getElementById('editCustomerModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      }
    
      saveChanges() {
        if (this.editForm.valid) {
          const updatedCustomer = { ...this.selectedCustomer, ...this.editForm.value };
          this.authService.updateCustomer(updatedCustomer).subscribe({
            next: () => {
              alert('Customer updated successfully!');
              this.loadCustomers(); 
              this.closeEditModal();    
            },
            error: (error) => {
              console.error('Update failed:', error);
              alert('Failed to update customer.');
            }
          });
        }
      }

    deleteCustomer(userId: number) {
        if (confirm('Are you sure you want to delete this customer?')) {
            const token = localStorage.getItem('authToken'); 
    
            if (!token) {
                alert('Authorization token missing!');
                return;
            }
    
            const headers = new HttpHeaders({
                'Authorization': `Bearer ${token}`
            });
    
            this.http.delete(`${this.apiUrl}/${userId}`, { headers }).subscribe({
                next: () => {
                    alert('Customer deleted successfully');
                    this.loadCustomers();
                },
                error: (error) => {
                    alert('Failed to delete customer: ' + error.statusText);
                }
            });
        }
    }

    openAddModal() {
        const modal = new bootstrap.Modal(document.getElementById('addCustomerModal'));
        modal.show();
      }
    
      closeAddModal() {
        const modalElement = document.getElementById('addCustomerModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      }

      saveNewCustomer() {
        if (this.addForm.valid) {
            const newCustomer = this.addForm.value;
            this.authService.createCustomer(newCustomer).subscribe({
                next: () => {
                    alert('Customer added successfully!');
                    this.loadCustomers(); 
                    this.closeAddModal(); 
                },
                error: (error) => {
                    console.error('Failed to add customer:', error);
                    alert('Error adding customer: ' + error.message);
                }
            });
        }
    }
}
