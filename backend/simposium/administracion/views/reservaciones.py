from rest_framework import viewsets, status
from rest_framework.permissions import SAFE_METHODS
from rest_framework.response import Response

from django.utils import timezone

from ..models import Reservacion, Pago, Conferencia
from ..permisos import PermisoReservaciones
from ..serializers import ReservacionSerializer, ReadReservacionSerializer


class ReservacionViewSet(viewsets.ModelViewSet):
    serializer_class = ReservacionSerializer
    queryset = Reservacion.objects.all()
    permission_classes = [PermisoReservaciones]

    def get_serializer_class(self):
        if self.request.method in SAFE_METHODS:
            return ReadReservacionSerializer
        return ReservacionSerializer

    def filter_queryset(self, queryset):
        for g in self.request.user.groups.all():
            if g.name == 'ASISTENTE':
                return queryset.filter(asistente=self.request.user.asistente)
        return queryset

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.asistente = request.user.asistente
        serializer.fecha = timezone.now()
        serializer.estado = Reservacion.PAGO_SIN_REGISTRAR
        try:
            pago = request.user.asistente.pago
            if pago.estado == Pago.ACEPTADO:
                serializer.estado = Reservacion.CONFIRMADA
            # elif pago.estado == Pago.PENDIENTE_VALIDACION:
            #     serializer.estado = Reservacion.PAGO_POR_VALIDAR
            # elif pago.estado in [Pago.EVALUACION_REEMBOLSO, Pago.REEMBOLSO_APROBADO, Pago.REEMBOLSADO, Pago.VALIDACION_RECHAZADA]:
            else:
                return Response({"detail": "No puedes hacer reservaciones"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"detail": "No puedes hacer reservaciones"}, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        conf = Conferencia.objects.get(pk=serializer.validated_data['conferencia'].id)
        if (conf.salon.capacidad - len(Reservacion.objects.filter(conferencia=conf).all())) <= 0:
            return Response({"detail": "Ya no hay cupo para esta conferencia"}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response((ReadReservacionSerializer(Reservacion.objects.get(pk=serializer.data["id"]))).data, status=status.HTTP_201_CREATED, headers=headers)
