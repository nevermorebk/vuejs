import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {deepOrange500} from "material-ui/styles/colors";
import AppBar from "material-ui/AppBar";
import EditTable from "material-ui-table-edit";
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';



const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 5,
    },
    menu: {
        display: 'inline-block',
        margin: '16px 32px 16px 0'
    },
    layout:{

    },
    sameLine:{
        display: 'inline'
    },
    block_container:{
        justifyContent: 'center',
        display: 'flex'
    }
};

const headers = [
    {value: 'Title Parent', type: 'TextField', width: 200},
    {value: 'Date', type: 'DatePicker', width: 200},
    {value: 'Title', type: 'TextField', width: 200},
    {value: 'Content', type: 'TextField', width: 200},
    {value: 'Ext Link', type: 'TextField', width: 100},
    {value: 'Enabled', type: 'Toggle', width: 50}
]
var isEdit = false;

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

var data = [];

export default class Main extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            value: 7
        };
        data = this.state.rows;
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, index, value) => {
        event.preventDefault();
        this.setState({
            value: value,
            rows: []
        });
        this.getData(value);
        console.log("Log 1: ");
        console.log(this.state.rows);
    };

  /*  componentDidUpdate(){
        this.getData(this.state.value);
    }*/

    getData(value){
        return $.getJSON('http://localhost:8080/notifications/?bvs=' + value)
            .then((data) => {
                data.news.map((obj, index) => {
                    obj.list.map((o, i) => {
                        var column = [
                            {value: obj.title},
                            {value: new Date(o.date)},
                            {value: o.title},
                            {value: o.content},
                            {value: o.ext_link},
                            {value: o.is_show == 'true'}

                        ];
                        this.state.rows.push({columns: column});
                    })
                });
                this.setState({
                    rows: this.state.rows
                });
                console.log("Log 2: ");
                console.log(this.state.rows);
            });
    }


    componentDidMount() {
        this.getData(this.state.value);
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }
    // componentWillUpdate(nextProps, nextState) {
    //     if (nextState.open == true && this.state.open == false) {
    //         this.props.onWillOpen();
    //     }
    // }



    render() {

        return <MuiThemeProvider muiTheme={muiTheme}>



            <div style={styles.container}>
                <h1>BiND notification management</h1>
                <div style={styles.block_container}>
                    <div style={styles.sameLine}>
                        <h3>Select bind version</h3>
                    </div>
                    <div style={styles.sameLine}>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} >
                            <MenuItem value={7} primaryText="BiND 7" />
                            <MenuItem value={8} primaryText="BiND 8" />
                            <MenuItem value={9} primaryText="BiND 9" />
                        </DropDownMenu>
                    </div>
                </div>
                <AppBar
                    title="List notification"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                />

                <EditTable onChange={onChange} headerColumns={headers} rows={this.state.rows}
                           enableDelete={Boolean(true)}></EditTable>

                <div style={styles.container}>

                    <TextField
                        disabled={true}
                        /*hintText="Disabled Hint Text"*/
                        defaultValue="Quick start: modal link = ext link"
                        fullWidth={true}
                    />
                </div>
                <div style={styles.container}>
                    <TextField
                        disabled={true}
                        fullWidth={true}
                        /*hintText="Disabled Hint Text"*/
                        defaultValue="Only 3 title parent: Important Notices, BiND CAMP, Support information"
                    />
                </div>

            </div>

        </MuiThemeProvider>
    }


}


const onChange = (row) => {
    isEdit = true;
    var item;
    var listNotice = [];
    var listCamp = [];
    var listSupport = [];
    for (var i = 0; i < data.length; i++) {
        item = new Object();
        item.id = i;
        item.titleParent = data[i].columns[0].value;
        item.ext_link = data[i].columns[4].value;
        item.is_show = data[i].columns[5].value.toString();
        if (item.titleParent === 'Important Notices') {
            delete item.titleParent;
            if (item.title == 'Quick start') {
                item.modal_link = item.ext_link;
                delete item.content;
                delete item.ext_link;
            }
            listNotice.push(item);
        }
        else if (item.titleParent === 'BiND CAMP') {
            delete item.titleParent;
            listCamp.push(item);
        }
        else if (item.titleParent === 'Support information') {
            delete item.titleParent;
            listSupport.push(item);
        }
    }
    var itemNotice = new Object();
    itemNotice.title = 'Important Notices';
    itemNotice.list = listNotice;

    var itemCamp = new Object();
    itemCamp.title = 'BiND CAMP';
    itemCamp.list = listCamp;

    var itemSupport = new Object();
    itemSupport.title = 'Support information';
    itemSupport.list = listSupport;

    var news = [];
    news.push(itemNotice, itemCamp, itemSupport);

    var ad = new Object();
    ad.title = "";
    ad.content = "";
    var schedule = [];

    var fullData = new Object();
    fullData.ad = ad;
    fullData.news = news;
    fullData.schedule = schedule;

    // $.getJSON('http://localhost:8080/notifications/')
    //     .then((data) => {
    //         // alert('Updated successfully!');
    //     });
    // var request = new XMLHttpRequest();
    // request.open('POST', 'http://localhost:8080/notifications/', true);
    // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // request.send(JSON.stringify(fullData));

    $.ajax({
        type: "get",
        dataType: 'string',
        data: JSON.stringify(fullData),
        url: 'http://localhost:8080/update/'
    }).done(
        alert('hehe')
    );


}

function handleTouchTap() {
    alert('onTouchTap triggered on the title component');
}
