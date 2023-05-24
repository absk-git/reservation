import { Component, OnInit } from '@angular/core';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  seats: number[][] = [];
  reservedSeats: number[] = [];
  errorMessage: string = '';
  showAlert: boolean = false;
  showSuccess: boolean = false;
  successMessage: string = '';
  fetchedDataId:any;

  constructor(private _service:ReservationService) {}

  ngOnInit() {
    this._service.fetchSeats().subscribe((res: any) =>{
      this.reserveSeats(res.seatCount, false); 
      this.fetchedDataId = res._id
    })
    this.drawCoach();
  }

  // toggleAlert() {
  //   this.showAlert = !this.showAlert;
  // }


  drawCoach() {
    //Creating 2D array for coach
    const rows = Math.floor(80 / 7); // Number of rows with 7 seats
    const lastRowSeats = 80 % 7; // Number of seats in the last row

    for (let i = 0; i < rows; i++) {
      const rowSeats = [];
      for (let j = 0; j < 7; j++) {
        rowSeats.push(0); // 0 is for available seats
      }
      this.seats.push(rowSeats);
      // console.log(rowSeats);
    }

    if (lastRowSeats > 0) {
      const lastRow = [];
      for (let i = 0; i < lastRowSeats; i++) {
        lastRow.push(0);
      }
      this.seats.push(lastRow);
    }
    console.log(this.seats);
  }

  reserveSeats(numSeats: any, showAlertSuccess: boolean) {
    const seatsToReserve = parseInt(numSeats);

    if (seatsToReserve > 80) {
      this.showAlert = true;
      this.errorMessage = 'You can select maximum 80 seats.';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    if (seatsToReserve <= 0) {
      this.showAlert = true;
      this.errorMessage = 'You can not select zero or negative';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    if (this.isCoachFull()) {
      this.showAlert = true;
      this.errorMessage = 'The coach is already full.';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
      return;
    }

    const availableSeats = this.checkForAvailableSeats(seatsToReserve);

    if (availableSeats.length >= seatsToReserve) {
      // Reserve the seats
      for (const seat of availableSeats) {
        const [row, col] = seat;
        this.seats[row][col] = 1; // 1 shows a reserve seat
        this.reservedSeats.push(row * 7 + col + 1); // To save the seat number
      }
      if (showAlertSuccess) {
        this.updateSeatData(this.fetchedDataId,{"seatCount":this.reservedSeats.length})
        this.showSuccess = true;
        this.successMessage = `Successfully reserved ${seatsToReserve} seat.`;
        this.fetchData()
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      }
    } else {
      this.showAlert = true;
      this.errorMessage = 'Not Enogh Seats, Please select less';
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }
  }

  checkForAvailableSeats(numSeats: number): number[][] {
    const availableSeats: number[][] = [];

    // Search for series available seats in one row
    for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
      const rowSeats = this.seats[rowIndex];
      let consecutiveSeats = 0;

      for (let seatIndex = 0; seatIndex < rowSeats.length; seatIndex++) {
        const seat = rowSeats[seatIndex];

        if (seat === 0) {
          consecutiveSeats++;
          if (consecutiveSeats === numSeats) {
            const startIndex = seatIndex - numSeats + 1;
            for (let i = startIndex; i <= seatIndex; i++) {
              availableSeats.push([rowIndex, i]);
            }
            return availableSeats;
          }
        } else {
          consecutiveSeats = 0;
        }
      }
    }

    // If no series seats are found, search for just near seats
    for (let rowIndex = 0; rowIndex < this.seats.length; rowIndex++) {
      const rowSeats = this.seats[rowIndex];

      for (let seatIndex = 0; seatIndex < rowSeats.length; seatIndex++) {
        const seat = rowSeats[seatIndex];

        if (seat === 0) {
          availableSeats.push([rowIndex, seatIndex]);
          if (availableSeats.length === numSeats) {
            return availableSeats;
          }
        }
      }
    }

    return availableSeats;
  }

  isCoachFull(): boolean {
    return this.reservedSeats.length === 80;
  }

  clearSeats() {
    this.reservedSeats = [];
    this.seats.forEach((row) => {
      row.fill(0);
      this.updateSeatData(this.fetchedDataId,{"seatCount":0})
    });
  }

  updateSeatData(id:any,data:any){
    this._service.update(id,data).subscribe(res=>{
      console.log(res);  
    })
  }

  fetchData(){
    this._service.fetchSeats().subscribe((res: any) =>{
      this.fetchedDataId = res._id
    })
  }
}
