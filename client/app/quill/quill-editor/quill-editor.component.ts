import { 
    Component,
    OnInit,
    Input,
    ElementRef,
    forwardRef,
    ViewChild
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR , NG_VALIDATORS } from "@angular/forms";


import * as QuillNamespace from "quill";
let Quill: any = QuillNamespace;

@Component({
    selector: 'hc-quill-editor',
    templateUrl: 'quill-editor.component.html',
    styleUrls:  [
        'quill-editor.component.css'
    ],
    providers: [{ 
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => QuillEditorComponent),
            multi: true
        }, { 
            provide: NG_VALIDATORS,
            useValue: (c: FormControl) => {
            let err = {
                selectionError: {
                given: null
                }
            };
            return typeof(c.value) !== "object" ? err : null;
            },
            multi: true
        }
    ]
})
export class QuillEditorComponent implements OnInit {
    
    constructor(private elementRef: ElementRef){};

    @Input() title: string;
    @Input() set readOnly(readOnly: boolean){
        if(this.quilEditor){
            if(readOnly){
                this.quilEditor.disable();
            }
            else {
                this.quilEditor.enable();
            }
        }
        this._readOnly = readOnly;
    }

    private _readOnly: boolean = false;
    private editorElem: HTMLElement;
    private editorToolbarElem: HTMLElement;
    private quilEditor: any;
    
    ngOnInit(){
        this.loadQuill();
    }

    private loadQuill(){
        var toolbarOptions: any = false;
        // if(!this._readOnly){
        //     toolbarOptions = [
        //         ['bold', 'underline'],
        //         ['blockquote', 'code-block'],
        //         [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //         [ 'image' ]
        //     ];
        // }

        this.editorToolbarElem = this.elementRef.nativeElement.querySelector('[quill-editor-toolbar-element]');
        this.editorElem = this.elementRef.nativeElement.querySelector('[quill-editor-element]');
        this.quilEditor = new Quill(this.editorElem, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: this.editorToolbarElem
                }
            },
            readOnly: this._readOnly
        });
    }
}
