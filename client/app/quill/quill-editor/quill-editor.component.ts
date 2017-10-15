import { 
    Component,
    OnInit,
    Input,
    ElementRef,
    forwardRef
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
    providers: [
    { 
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => QuillEditorComponent),
        multi: true
    },
    { 
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
})
export class QuillEditorComponent implements OnInit {
    
    constructor(private elementRef: ElementRef){};

    @Input() title: string;
    @Input() readOnly: boolean = true;
    
    private editorElem: HTMLElement;
    private quilEditor: any;
    
    ngOnInit(){
        var toolbar: any = false;
        if(!this.readOnly){
            toolbar = [
                ['bold', 'underline'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [ 'image' ]
            ];
        }
        this.editorElem = this.elementRef.nativeElement.querySelector('[quill-editor-element]');
        this.quilEditor = new Quill(this.editorElem, {
            theme: 'snow',
            modules: {
                toolbar: toolbar
            },
            readOnly: this.readOnly
        });

        setTimeout(() => {
            var delta = this.quilEditor.getContents();
            
            console.log(delta);
        }, 10000);
    }
}
