package com.boda.planner.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class WeddingRequest {
    @NotNull(message = "El id del usuario propietario es obligatorio")
    private Long ownerUserId;

    @NotBlank(message = "El titulo de la boda es obligatorio")
    private String title;

    @NotBlank(message = "El nombre de la primera persona es obligatorio")
    private String partnerOneName;

    @NotBlank(message = "El nombre de la segunda persona es obligatorio")
    private String partnerTwoName;

    @NotNull(message = "La fecha de la boda es obligatoria")
    private LocalDate weddingDate;

    private String venueName;

    private String venueAddress;

    @NotNull(message = "El maximo de invitados es obligatorio")
    @Min(value = 1, message = "Debe permitir al menos 1 invitado")
    private Integer maxRegisteredGuests;
}
