import { Component, OnInit } from '@angular/core';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICuenta } from '../../models/ICuenta';
import { CuentaService } from '../../services/cuenta.service';
import { IPago, EstadoPago } from '../../models/IPago';
import { PagoService } from '../../services/pago.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent implements OnInit {

  // representacion de un pago sin registrar
  static PAGO_SINREGISTRAR: IPago = {
    codigo_pago: '',
    cuenta_id: 0,
    titular_id: 0,
    foto: '',
    fecha: '',
    hora: '',
    estado: 0
  };

  PAGO_PENDIENTE_VALIDACION = EstadoPago.PENDIENTE_VALIDACION;
  PAGO_ACEPTADO = EstadoPago.ACEPTADO;
  PAGO_RECHAZADO = EstadoPago.RECHAZADO;
  PAGO_EVALUACION_REEMBOLSO = EstadoPago.EVALUACION_REEMBOLSO;
  PAGO_REEMBOLSO_APROBADO = EstadoPago.REEMBOLSO_APROBADO;
  PAGO_REEMBOLSADO = EstadoPago.REEMBOLSADO;

  TEXTO_ESTADOSPAGO: string[] = [];

  faEdit = faEdit;
  faSave = faSave;
  faTimes = faTimes;

  public cuentas: ICuenta[] = [];
  public pago: IPago = null;
  public registrandoPago = false;

  public guardando = false;

  private fotoStr = '';
  private fotoStrEdicion = '';

  public formRegistroPago = new FormGroup({
    codigo_recibo: new FormControl('', [
      Validators.required,
    ]),
    id_cuenta: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),
    foto: new FormControl('', [
      Validators.required,
    ])
  });

  public formEdicionPago = new FormGroup({
    codigo_recibo: new FormControl('', [
      Validators.required,
    ]),
    id_cuenta: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),
    foto: new FormControl('', [])
  });

  constructor(
    private pagoService: PagoService,
    private cuentaService: CuentaService,
    private auth: AuthService,
    private modalService: NgbModal
  ) {
    this.TEXTO_ESTADOSPAGO[0] = 'Sin pagar';
    this.TEXTO_ESTADOSPAGO[EstadoPago.PENDIENTE_VALIDACION] = 'Pendiente de validación';
    this.TEXTO_ESTADOSPAGO[EstadoPago.ACEPTADO] = 'Aceptado';
    this.TEXTO_ESTADOSPAGO[EstadoPago.RECHAZADO] = 'Rechazado';
    this.TEXTO_ESTADOSPAGO[EstadoPago.EVALUACION_REEMBOLSO] = 'En evaluación de reembolso';
    this.TEXTO_ESTADOSPAGO[EstadoPago.REEMBOLSO_APROBADO] = 'Reembolso aprobado';
    this.TEXTO_ESTADOSPAGO[EstadoPago.REEMBOLSADO] = 'Reembolsado';
  }

  ngOnInit() {
    this.pago = PagoComponent.PAGO_SINREGISTRAR;
    this.cargarPago();
    this.cuentaService.getAll().subscribe((res) => {
      this.cuentas = res;
    }, console.error);
  }

  public onSubmitFormRegistroPago(): void {
    if (!this.formRegistroPago.valid) return;

    this.guardando = true;
    const pago = this.formRegistroPago.value;

    this.pagoService.create({
      codigo_pago: pago.codigo_recibo,
      cuenta_id: pago.id_cuenta,
      foto: this.fotoStr,
      estado: EstadoPago.PENDIENTE_VALIDACION,
      titular_id: this.auth.user.id
    }).subscribe((res) => {
      this.pago = res;
      this.guardando = false;
      this.modalService.dismissAll();
    }, error => {
      this.guardando = false;
      console.error(error);
    });

  }

  public onSubmitFormEdicionPago(): void {
    if (!this.formEdicionPago.valid) return;

    this.guardando = true;
    const pago = this.formEdicionPago.value;

    this.pagoService.update({
      codigo_pago: pago.codigo_recibo,
      titular_id: this.pago.titular_id,
      cuenta_id: pago.id_cuenta,
      foto: this.fotoStrEdicion,
      estado: this.pago.estado,
    }).subscribe((res) => {
      this.pago = res;
      this.guardando = false;
      this.modalService.dismissAll();
    }, error => {
      this.guardando = false;
      console.error(error);
    });
  }

  public openModalRegistroPago(content): void {
    this.formRegistroPago.reset({ foto: '' });
    this.modalService.dismissAll();
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      windowClass: 'animated bounceIn'
    });
  }

  public openModalEdicionPago(content): void {
    this.fotoStrEdicion = this.pago.foto;
    this.formEdicionPago.reset({
      codigo_recibo: this.pago.codigo_pago,
      id_cuenta: this.pago.cuenta_id,
      foto: ''
    });
    this.modalService.dismissAll();
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      windowClass: 'animated bounceIn'
    });
  }

  public onChangeFotoRecibo(event): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.querySelector('#img-recibo');
      const fotoBase64 = reader.result + '';
      img.setAttribute('src', fotoBase64);
      this.fotoStr = fotoBase64;
    };
    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public onChangeFotoEdicionRecibo(event): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.querySelector('#img-edicion-recibo');
      const fotoBase64 = reader.result + '';
      img.setAttribute('src', fotoBase64);
      this.fotoStrEdicion = fotoBase64;
    };
    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private cargarPago(): void {
    this.pagoService.get(this.auth.user.id)
      .subscribe((res) => {
        this.pago = res;
      }, console.error);
  }

  /*private cargarCuenta(): void {
    this.cuentaService.get(this.pago.cuenta.id)
      .subscribe((resCuenta) => {
        this.cuenta = resCuenta;
      }, console.error);
  }*/

}
