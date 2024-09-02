import { Component } from '@angular/core';
import { NewsService } from '../../service/news.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  articles: any[] = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.newsService.getNews().subscribe((data) => {
      this.articles = data.articles;
      console.log(data.articles)
    });
  }
}
