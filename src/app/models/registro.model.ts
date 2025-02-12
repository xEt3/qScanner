export class Registro{

    public format:string;
    public text:string;
    public type:string;
    public icon :string;
    public created:Date;

    constructor(format:string,text:string){
        this.format=format;
        this.text=text;
        this.created=new Date();
        this.determinarTipo();
    }

    private determinarTipo(){
        const inicioTexto = this.text.substr(0,4);
        console.log('tipo', inicioTexto);
        switch(inicioTexto){
            case 'http':
                this.type='http'
                this.icon='globe'
                break;
            case 'geo:':
                this.type='geo:'
                this.icon='pin'
                break;
            case 'WIFI':
                this.type='wifi'
                this.icon='wifi'
                break ;
            default:
                this.type='no reconocido'
                this.icon='create'
                break;
        }
    }
}