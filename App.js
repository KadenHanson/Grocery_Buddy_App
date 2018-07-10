import React from 'react';
import { Font } from 'expo';
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Card, Toolbar, Icon } from 'react-native-material-ui';
import Prompt from 'rn-prompt';
import { Items } from './Items';

export function FormatMoney(value) {
    var number = parseFloat(value);
    var result = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);

    return result == '0.00' ? '0' : result;
}

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.addItemPress = this.addItemPress.bind(this);
        this.addMultipleItemsPress = this.addMultipleItemsPress.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addMultipleItems = this.addMultipleItems.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.addToSubtotal = this.addToSubtotal.bind(this);
        this.subtractTotal = this.subtractTotal.bind(this);
        this.calculateTax = this.calculateTax.bind(this);

        this.state = {
            fontLoaded: false,
            subtotalAmount: 0,
            taxAmount: 0,
            itemCount: 0,
            totalAmount: 0,
            promptVisible: false,
            listPromptVisible: false,
            currentKey: 0,
            itemList: []
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Roboto': require('./assets/fonts/Roboto-Regular.ttf')
        });

        this.setState({ fontLoaded: true });
    }

    addToSubtotal(amount) {
        var _amount = parseFloat(amount);
        var _subtotalAmount = parseFloat(this.state.subtotalAmount);
        var newSubtotal = _subtotalAmount + _amount;
        var taxAmount = parseFloat(this.calculateTax(newSubtotal));
        var _totalAmount = newSubtotal + taxAmount;

        this.setState({ subtotalAmount: FormatMoney(newSubtotal), taxAmount: FormatMoney(taxAmount), totalAmount: FormatMoney(_totalAmount) });
    }

    subtractTotal(amount) {
        var _amount = parseFloat(amount);
        var _subtotalAmount = parseFloat(this.state.subtotalAmount);
        var newSubtotal = _subtotalAmount - _amount;
        var taxAmount = parseFloat(this.calculateTax(newSubtotal));
        var _totalAmount = newSubtotal + taxAmount;

        this.setState({ subtotalAmount: FormatMoney(newSubtotal), taxAmount: FormatMoney(taxAmount), totalAmount: FormatMoney(_totalAmount) });
    }

    addItemPress() {
        this.setState({ promptVisible: true });
    }

    addMultipleItemsPress() {
        this.setState({ listPromptVisible: true });
    }

    addItem(value) {
        var list = this.state.itemList;
        var currentKey = this.state.currentKey + 1;

        var itemName = value.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        list.push({ id: currentKey, name: itemName });

        this.setState({ itemList: list, itemCount: list.length, currentKey: currentKey });
    }

    addMultipleItems(items) {
        var list = this.state.itemList;
        var currentKey = this.state.currentKey + 1;

        var itemList = items.split(',');

        var _itemList = itemList.map((item) => {
            currentKey++;
            var _itemName = item.charAt(0).replace(' ', '') + item.slice(1);
            var itemName = _itemName.replace(/\w\S*/g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            list.push({ id: currentKey, name: itemName });
        });

        this.setState({ itemList: list, itemCount: list.length, currentKey: currentKey });
    }

    removeItem(indexToRemove) {
        var list = this.state.itemList;
        var listItemToRemove;

        list.some(function (item) {
            if (item.id == indexToRemove) {
                listItemToRemove = list.indexOf(item);
            }
        });

        if (listItemToRemove == undefined) {
            return false;
        }

        list.splice(listItemToRemove, 1);

        this.setState({ itemList: list, itemCount: list.length });
    }

    calculateTax(subtotalAmount) {
        var taxRate = 0.0575;
        var result = 0;

        result = subtotalAmount * taxRate;
        result.toFixed(2);

        return result;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#eaeaea' }}>
                <Prompt
                    title="Please enter an item"
                    visible={this.state.promptVisible}
                    onCancel={() => this.setState({
                        promptVisible: false
                    })}
                    onSubmit={(value) => (this.setState({
                        promptVisible: false
                    }), this.addItem(value))}
                />
                <Prompt
                    title="Please enter a list of items, separated by a comma"
                    visible={this.state.listPromptVisible}
                    onCancel={() => this.setState({
                        listPromptVisible: false
                    })}
                    onSubmit={(value) => (this.setState({
                        listPromptVisible: false
                    }), this.addMultipleItems(value))}
                />
                {
                    this.state.fontLoaded ? (
                        <View style={{ flex: 1, backgroundColor: '#eaeaea' }}>
                            <View style={styles.statusBar} />
                            <StatusBar barStyle="light-content" />
                            <Toolbar
                                centerElement="Grocery Buddy"
                                rightElement="menu"
                                onRightElementPress={(label) => { console.log(label) }}
                                style={{ container: { backgroundColor: '#456990' } }}
                            />
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <ScrollView contentContainerStyle={styles.container}>
                                    <View style={styles.addContainer}>
                                        <TouchableOpacity onPress={this.addItemPress} style={styles.addTouch}>
                                            <View style={{ marginRight: 5 }}>
                                                <Text>Add Item</Text>
                                            </View>
                                            <View style={{ marginRight: 10 }}>
                                                <Icon
                                                    name="add-circle"
                                                    color="#89C440"
                                                    size={35}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.addMultipleItemsPress} style={styles.addTouch}>
                                            <View style={{ marginRight: 5 }}>
                                                <Text>Add Item List</Text>
                                            </View>
                                            <View>
                                                <Icon
                                                    name="add-circle"
                                                    color="#89C440"
                                                    size={35}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Card
                                        style={{
                                            container: {
                                                overflow: 'visible',
                                                shadowOpacity: 0.10,
                                                shadowRadius: 6,
                                                shadowOffset: { height: 5, width: 0 },
                                                shadowColor: '#000',
                                                width: '100%',
                                                minHeight: '80%',
                                                alignItems: 'center',
                                                padding: 10
                                            }
                                        }}
                                    >
                                        {
                                            itemListArr = this.state.itemList.map(itemInfo => (
                                                <Items
                                                    name={itemInfo.name}
                                                    key={itemInfo.id}
                                                    index={itemInfo.id}
                                                    removeItem={this.removeItem}
                                                    addToSubtotal={this.addToSubtotal}
                                                    subtractTotal={this.subtractTotal}
                                                    lastItem={this.state.itemList.indexOf(itemInfo) == (this.state.itemList.length - 1) ? true : false}
                                                />
                                            ))
                                        }
                                    </Card>
                                </ScrollView>
                            </View>
                            <View style={styles.footer}>
                                <View style={styles.footerParts}>
                                    <Text style={{ color: 'white', textAlign: 'left' }}>Items: {this.state.itemCount}</Text>
                                </View>
                                <View style={styles.footerParts}>
                                    <Text style={{ color: 'white', textAlign: 'right' }}>Total: ${FormatMoney(this.state.totalAmount)}</Text>
                                </View>
                            </View>
                        </View>
                    ) : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    statusBar: {
        height: 21,
        backgroundColor: '#3F6184'
    },
    container: {
        flex: 0,
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
        padding: 20
    },
    footer: {
        height: 75,
        backgroundColor: '#456990',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    footerParts: {
        justifyContent: 'center',
        width: '45%'
    },
    addContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        width: '100%'
    },
    addTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 'auto',
        flexWrap: 'wrap'
    }
});