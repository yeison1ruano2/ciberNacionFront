import { Component, inject, OnInit } from '@angular/core';
import { TareaService } from '../../services/tarea.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  fechaLimite: string;
  activo: boolean;
}

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.css',
})
export class TareaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tareaService = inject(TareaService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  tareas: Tarea[] = [];
  formTarea!: FormGroup;
  formFiltros!: FormGroup;
  formState!: FormGroup;
  proyectoId!: number;

  page = 0;
  size = 5;
  pageSize = 5;
  totalPages = 0;
  loading = false;
  modalOpen = false;
  modalStatus = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.inicializarFormularioFiltros();
    this.inicializarFormularioStates();
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.proyectoId) {
      const filtros = this.formFiltros.value;
      this.tareaService
        .filtrarTareas(this.proyectoId, filtros, this.page, this.size)
        .subscribe({
          next: (response) => {
            this.tareas = response.content;
            this.totalPages = response.totalPages;
            this.page = response.number;
            this.loading = false;
          },
        });
    }
  }

  inicializarFormulario() {
    this.formTarea = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaLimite: ['', Validators.required],
      prioridad: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  inicializarFormularioFiltros() {
    this.formFiltros = this.fb.group({
      prioridad: [''],
      fechaLimite: [''],
      activo: ['true'],
      estado: [''],
    });
  }

  inicializarFormularioStates() {
    this.formState = this.fb.group({
      estado: [''],
      id: [null],
    });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }

  guardarEstado() {
    if (this.formState.invalid) return;
    const { estado, id } = this.formState.value;
    this.tareaService.actualizarEstadoTarea(id, estado).subscribe({
      next: () => {
        this.filtrarTareas();
        this.cerrarModalStatus();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Estado de la tarea actualizado correctamente',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
      error: (error) => {
        Swal.fire(
          'Error',
          'No se pudo actualizar el estado de la tarea.',
          'error',
        );
      },
    });
  }

  filtrarTareas() {
    this.loading = true;
    const filtros = this.formFiltros.value;
    this.tareaService
      .filtrarTareas(this.proyectoId, filtros, this.page, this.size)
      .subscribe({
        next: (response) => {
          this.tareas = response.content;
          this.totalPages = response.totalPages;
          this.page = response.number;
          this.loading = false;
        },
        error: (error) => {
          console.warn('Error al filtrar tareas:', error);
          Swal.fire('Error', 'No se pudieron cargar las tareas.', 'error');
          this.loading = false;
        },
      });
  }

  cerrarModal() {
    this.modalOpen = false;
    this.formTarea.patchValue({
      titulo: '',
      descripcion: '',
      fechaLimite: '',
      prioridad: '',
      estado: '',
    });
  }

  limpiarFiltros() {
    this.formFiltros.patchValue({
      prioridad: '',
      estado: '',
      fechaLimite: null,
    });
    this.page = 0;
    this.filtrarTareas();
  }

  guardarTarea() {
    if (this.formTarea.invalid) return;
    const tarea = this.formTarea.value;
    this.tareaService.crearTarea(tarea, this.proyectoId).subscribe({
      next: (response) => {
        console.log('Tarea creada con éxito:', response);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Tarea guardada correctamente',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.cerrarModal();
        this.filtrarTareas();
      },
      error: (error) => {
        console.warn('Error al guardar la tarea:', error);
        Swal.fire('Error', 'No se pudo guardar la tarea.', 'error');
      },
    });
  }

  cerrarModalStatus() {
    this.modalStatus = false;
    this.formState.patchValue({
      estado: '',
      id: null,
    });
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.page + delta;

    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;

    this.page = nuevaPagina;
    this.filtrarTareas();
  }

  crearTarea() {
    this.modalOpen = true;
  }

  cambiarEstado(id: number) {
    this.tareaService.obtenerTareaId(id).subscribe({
      next: (response) => {
        this.formState.patchValue({
          estado: response.estado,
          id: response.id,
        });
        this.modalStatus = true;
      },
      error: (error) => {
        console.warn('Error al obtener la tarea:', error);
      },
    });
  }

  editarTarea(id: number) {
    this.tareaService.obtenerTareaId(id).subscribe({
      next: (response) => {
        this.formTarea.patchValue({
          titulo: response.titulo,
          descripcion: response.descripcion,
          fechaLimite: response.fechaLimite,
          prioridad: response.prioridad,
          estado: response.estado,
        });
        this.modalOpen = true;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo cargar la tarea.', 'error');
        console.warn('Error al obtener la tarea:', error);
      },
    });
  }

  eliminarTarea(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la tarea permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareaService.eliminarTarea(id).subscribe({
          next: (response) => {
            console.log('Tarea eliminada con éxito:', response);
            this.filtrarTareas();
            Swal.fire('¡Eliminado!', 'La tarea ha sido borrada.', 'success');
          },
          error: (error) => {
            console.warn('Error al eliminar la tarea:', error);
            Swal.fire('Error', 'No se pudo eliminar la tarea.', 'error');
          },
        });
      }
    });
  }
}
