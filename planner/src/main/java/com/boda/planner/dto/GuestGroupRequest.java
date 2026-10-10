package com.boda.planner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GuestGroupRequest {

    @NotBlank(message = "El nombre del grupo es obligatorio")
    private String contactName;

    @Email(message = "El correo debe tener un formato valido")
    private String contactEmail;

    private String contactPhone;

    @NotNull(message = "La cantidad de pases es obligatoria")
    @Min(value = 1, message = "Debe tener al menos 1 pase")
    private Integer maxGuestsAllowed;

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public Integer getMaxGuestsAllowed() {
        return maxGuestsAllowed;
    }

    public void setMaxGuestsAllowed(Integer maxGuestsAllowed) {
        this.maxGuestsAllowed = maxGuestsAllowed;
    }
}
