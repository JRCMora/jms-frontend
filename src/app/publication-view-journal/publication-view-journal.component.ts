import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalService } from '../journal.service';

@Component({
  selector: 'app-publication-view-journal',
  templateUrl: './publication-view-journal.component.html',
  styleUrls: ['./publication-view-journal.component.css']
})
export class PublicationViewJournalComponent implements OnInit {
  journalId: string | null = null;
  journal: any;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.journalId = params.get('journalId');
      if (this.journalId) {
        this.getJournalDetails(this.journalId);
      } else {
        this.error = 'Journal ID not provided';
      }
    });
  }
  

  getJournalDetails(journalId: string): void {
    this.journalService.getJournalById(journalId).subscribe(
      (data) => {
        this.journal = data;
      },
      (error) => {
        console.error(error);
        this.error = 'Error fetching journal details';
      }
    );
  }
}
