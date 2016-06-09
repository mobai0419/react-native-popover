
"use strict";

import React, {
    Component,
    PropTypes,
} from 'react';

import {
  ListView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';

var SCREEN_HEIGHT = Dimensions.get('window').height;
var noop = () => {};
var ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});

export default class Popover extends Component{

  propTypes: {
    title:PropTypes.string,
    list: PropTypes.array.isRequired,
    isVisible: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
  }

  static defaultProps = {
      list: [],
      isVisible: false,
      onClick: noop,
      onClose: noop
  }; 

  constructor(props) {
    super(props);
    this.state = {
       dataSource: ds.cloneWithRows(this.props.list)
    };

  }

  componentWillReceiveProps(nextProps:any) {
    if (nextProps.list !== this.props.list) {
      this.setState({dataSource: ds.cloneWithRows(nextProps.list)});
    }
  }

  handleClick(data) {
    this.props.onClick(data);
    this.props.onClose();
  }

  renderRow(rowData) {
    var separatorStyle = this.props.separatorStyle || DefaultStyles.separator;
    var rowTextStyle = this.props.rowText || DefaultStyles.rowText;

    var separator = <View style={separatorStyle}/>;
    if (rowData === this.props.list[0]) {
      separator = null;
    }

    var row = <Text style={rowTextStyle}>{rowData}</Text>
    if (this.props.renderRow) {
      row = this.props.renderRow(rowData);
    }

    return (
      <View>
            <TouchableOpacity onPress={() => this.handleClick(rowData)}>
              {row}
            </TouchableOpacity>
      </View>
    );
  }

  renderList() {
    var styles = this.props.style || DefaultStyles;
    // var maxHeight = {};
    // if (this.props.list.length > 12) {
    //   maxHeight = {height: SCREEN_HEIGHT * 3/4};
    // }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        automaticallyAdjustContentInsets={false}
      />
    );
  }

  redenrTitle(){
    var rowTitleStyle = this.props.rowTitle || DefaultStyles.rowTitle;
    var title = <Text style={rowTitleStyle}>{this.props.title}</Text>
    if (!this.props.title) {
      title = null
    }
    return(
      <View>
            {title}
      </View>
      )
  }

  render(){
    var containerStyle = this.props.containerStyle || DefaultStyles.container;
    var popoverStyle = this.props.popoverStyle || DefaultStyles.popover;

    if (this.props.isVisible) {
      return (
        <View>
          <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {this._setModalVisible(false)}}
                 >
                  <View style={containerStyle}>
             <View style={popoverStyle}>
                {this.redenrTitle()}
                
                {this.renderList()}
               
             </View>
          </View>
          </Modal>
        </View>
      );
    } else {
      return (<View/>);
    }
  }
};

var DefaultStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    paddingLeft:40,
    paddingRight:40,
    backgroundColor:'rgba(0, 0, 0, 0.5)'
  },
  popover: {
    borderRadius: 3,
    padding: 3,
    backgroundColor: '#ffffff',
  },
  rowText: {
    padding: 10,
    textAlign:'center',
  },
  rowTitle:{
    textAlign:'center',
    color:'#8CC63E',
    fontSize:18,
    lineHeight:30
  },
  separator: {
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: 'red',
  },
});