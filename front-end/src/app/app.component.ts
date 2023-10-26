import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  DocumentAnalysisClient,
  AzureKeyCredential,
} from '@azure/ai-form-recognizer';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  word: string = '';
  isLoading: boolean = false;
  title = 'front-end';
  form: FormGroup;
  client: any;

  convertedWord: string = '';
  countryList: any = [];
  selectedLanguage: any; // Variable to store the selected language
  translatedtext: any;
  selected = '';
  selectedFile: File | null = null;
  baseUrl = 'http://localhost';
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({});
  }
  ngOnInit() {
    this.http
      .get(
        'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation'
      )
      .subscribe(
        (data: any) => {
          console.log(data['translation']);

          for (var key in data['translation']) {
            // console.log(key);
            // console.log(data["translation"][key]);
            this.countryList.push({
              key: key,
              value: data['translation'][key].nativeName,
            });
          }
          console.log(this.countryList);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  update(e: any) {
    this.selected = e.target.value;
  }
  translate() {
    this.http
      .post(this.baseUrl + ':4204/translate', {
        text: this.convertedWord,
        to: this.selected,
      })
      .subscribe(
        (data: any) => {
          this.translatedtext = data[0].translations[0].text;
          this.synthesizeAudio();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert('No File Selected');
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post(this.baseUrl + ':4202/upload', formData).subscribe(
      (response: any) => {
        console.log('Image uploaded successfully:', response);
        this.word = response['analysis_result'];
        this.http
          .get(this.baseUrl + ':4203/convert?numbers=' + this.word)
          .subscribe(
            (data: any) => {
              this.convertedWord = data['convertedText'];
            },
            (error) => {
              console.log('Error converting text:', error);
            }
          );
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error uploading image:', error);
      }
    );
  }
  text = '';
  audioURL: string | null = null;
  synthesizeAudio() {
    const apiUrl = this.baseUrl+":4205/synthesize"; // Update with your Express.js server URL
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { text:  this.translatedtext };

    this.http.post(apiUrl, body, { headers, responseType: 'blob' }).subscribe(
      (data: any) => {
        const audioBlob = new Blob([data], { type: 'audio/mpeg' });
        this.audioURL = URL.createObjectURL(audioBlob);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
