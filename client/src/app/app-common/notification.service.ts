import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotificationService {

    constructor(
        public snackBar: MatSnackBar
    ) {}
  
    /**
     * Displays a message to the string as an info notification.
     * @param message The message to display.
     * @param action The action to clic on to hide the notification.
     * @param duration How long the notification stays.
     */
    public info(message: string, action: string = "DISMISS", duration: number = 3000){
        this.snackBar.open(message, action, {
            "duration": duration
        });
    }

    /**
     * Displays a message to the string as an error notification.
     * @param message The message to display.
     * @param action The action to clic on to hide the notification.
     * @param duration How long the notification stays.
     */
    public error(message: string, action: string = "DISMISS", duration: number = 3000){
        this.info(message, action, duration);
    }
}