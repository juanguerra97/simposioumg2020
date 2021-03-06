import { Component, OnInit } from '@angular/core';
import { faPlus, faTrashAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng';
import { ToastrService } from 'ngx-toastr';

import { ICuenta } from '../../models/ICuenta';
import { CuentaService } from '../../services/cuenta.service';
import { ErrorWithMessages, ErrorWithToastr } from '../../utils/errores';
import { pedirConfirmacion } from '../../utils/confirmaciones';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {

  faPlus = faPlus;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faSave = faSave;
  faTimes = faTimes;

  public erroresFormCuenta: ErrorWithMessages;
  public erroresEliminacion: ErrorWithToastr;

  public opcionNuevaCuenta = true;
  public cuentas: ICuenta[] = [];
  public selectedCuenta: ICuenta = null;

  public guardando = false;

  public formCuenta = new FormGroup({
    numero: new FormControl('', [
      Validators.required,
      Validators.maxLength(64),
    ]),
    banco: new FormControl('', [
      Validators.required,
      Validators.maxLength(64),
    ]),
    titular: new FormControl('', [
      Validators.required,
      Validators.maxLength(128),
    ]),
  });

  constructor(
    private cuentaService: CuentaService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private messageService: MessageService,
  ) {
    this.erroresFormCuenta = new ErrorWithMessages(this.messageService,() => this.guardando = false);
    this.erroresEliminacion = new ErrorWithToastr(this.toastr);
  }

  ngOnInit() {
    this.cuentaService.getAll().subscribe((res) => {
      this.cuentas = res;
    }, console.error);
  }

  public onSubmitFormCuenta(): void {

    if (!this.formCuenta.valid) return;
    this.guardando = true;

    if (this.opcionNuevaCuenta) {
      this.cuentaService.create(this.formCuenta.value)
        .subscribe((res) => {

          this.cuentas.push(res);

          this.guardando = false;
          this.modalService.dismissAll();

        }, error => this.erroresFormCuenta.showError(error));
    } else {
      const cuenta = this.formCuenta.value;
      cuenta.id = this.selectedCuenta.id;
      this.cuentaService.update(cuenta)
        .subscribe((res) => {

          this.selectedCuenta.numero = res.numero;
          this.selectedCuenta.banco = res.banco;
          this.selectedCuenta.titular = res.titular;

          this.guardando = false;
          this.modalService.dismissAll();
        }, error => this.erroresFormCuenta.showError(error));

    }

  }

  public onEliminarCuenta(): void {
    if (this.selectedCuenta == null) return;

    pedirConfirmacion('Estas a punto de eliminar una cuenta',
      'La eliminacion no se puede revertir',
      'Eliminar')
      .then((result) => {
        if (result.value) {
          this.cuentaService.delete(this.selectedCuenta.id)
            .subscribe((res) => {

              this.cuentas.splice(this.cuentas.findIndex((c) => c.id === this.selectedCuenta.id), 1);
              this.selectedCuenta = null;

            }, err => this.erroresEliminacion.showError(err));
        }
      });
  }

  public onCuentaClicked(cuenta: ICuenta): void {
    if (this.selectedCuenta == null || this.selectedCuenta.id !== cuenta.id) {
      this.selectedCuenta = cuenta;
    } else {
      this.selectedCuenta = null;
    }
  }

  public openModalNueva(content): void {
    this.opcionNuevaCuenta = true;
    this.formCuenta.reset();
    this.openModal(content);
  }

  public openModalEditar(content): void {
    if (this.selectedCuenta == null) return;
    this.opcionNuevaCuenta = false;
    this.formCuenta.reset(this.selectedCuenta);
    this.openModal(content);
  }

  public openModal(content): void {
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      windowClass: 'animated bounceIn'
    });
  }

}
