package com.boda.planner.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class RsvpRequest {

    private String message;

    @Valid
    @NotEmpty(message = "Debe enviar al menos un invitado")
    private List<GuestRequest> guests;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<GuestRequest> getGuests() {
        return guests;
    }

    public void setGuests(List<GuestRequest> guests) {
        this.guests = guests;
    }
}
