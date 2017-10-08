import { 
    Component,
    OnInit,
    ElementRef
} from '@angular/core';

import * as QuillNamespace from "quill";
let Quill: any = QuillNamespace;

@Component({
selector: 'hc-quill-editor',
templateUrl: 'quill-editor.component.html',
styleUrls:  [
    'quill-editor.component.css'
    ]
})
export class QuillEditorComponent implements OnInit {

    constructor(private elementRef: ElementRef){};

    private editorElem: HTMLElement;
    private quilEditor: any;
    
    ngOnInit(){
        this.editorElem = this.elementRef.nativeElement.querySelector('[quill-editor-element]');
        this.quilEditor = new Quill(this.editorElem, {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'underline'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [ 'image' ]
                ]
            },
            readOnly: true
        });

        setTimeout(() => {
            var delta = this.quilEditor.getContents();
            console.log(delta);
        }, 10000);
    }
}
