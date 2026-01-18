import { Component, inject, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NumberSymbol } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  totalTareas: number;
}

@Component({
  selector: 'app-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './proyecto.component.html',
  styleUrl: './proyecto.component.css',
})
export class ProyectoComponent implements OnInit {
  private proyectoService = inject(ProyectoService);
  private fb = inject(FormBuilder);
  proyectos: Proyecto[] = [];
  formProyecto!: FormGroup;
  loading = false;
  modalOpen = false;
  totalPages = 0;
  page = 0;
  size = 2;
  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.loading = true;
    this.proyectoService.listarProyectos(this.page, this.size).subscribe({
      next: (response) => {
        this.proyectos = response.content;
        this.totalPages = response.totalPages;
        this.page = response.number;
        this.loading = false;
      },
      error: (error) => {
        console.warn('Error al cargar proyectos', error);
        Swal.fire('Error', 'Error al cargar proyectos', 'error');
        this.loading = false;
      },
    });
  }

  inicializarFormulario() {
    this.formProyecto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  crearProyecto() {
    this.modalOpen = true;
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.page + delta;
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.cargarProyectos();
  }

  guardarProyecto() {
    if (this.formProyecto.invalid) return;
    const proyecto = this.formProyecto.value;
    this.proyectoService.crearProyecto(proyecto).subscribe({
      next: (res) => {
        Swal.fire('Proyecto creado', '', 'success');
        this.formProyecto.patchValue({
          nombre: '',
          descripcion: '',
        });
        this.cargarProyectos();
        this.cerrarModal();
      },
      error: (err) => {
        console.warn('Error al crear proyecto', err);
        Swal.fire('Error', 'Error al crear proyecto', 'error');
      },
    });
  }

  eliminarProyecto(id: number, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: '¿Eliminar proyecto?',
      text: 'Se borrarán todas las tareas asociadas',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectoService.eliminarProyecto(id).subscribe({
          next: () => {
            this.cargarProyectos();
            Swal.fire('¡Eliminado!', 'El proyecto ha sido borrado.', 'success');
          },
        });
      }
    });
  }

  cerrarModal() {
    this.formProyecto.patchValue({
      nombre: '',
      descripcion: '',
    });
    this.modalOpen = false;
  }
}
