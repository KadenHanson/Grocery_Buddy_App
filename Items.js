import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Checkbox, IconToggle } from 'react-native-material-ui';
import Prompt from 'rn-prompt';
import { FormatMoney } from './App';

export class Items extends React.Component {
    constructor(props) {
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
        this.checkFormat = this.checkFormat.bind(this);

        this.state = {
            name: this.props.name,
            value: FormatMoney(0),
            checked: false,
            promptVisible: false,
            index: this.props.index
        };
    }

    checkFormat(value) {
        var format = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

        if (value == '') {
            alert('Please enter a value');
            return false;
        }
        if (FormatMoney(value) == '0.00' || FormatMoney(value) == 0) {
            alert('Item cannot be $0.00');
            return false;
        }
        if (!format.test(value)) {
            alert('Please enter number in the correct format');
            return false;
        }

        return true;
    }

    handleCheck() {
        var isChecked = this.state.checked == true ? false : true;

        isChecked == true ? this.setState({ promptVisible: true }) : null;
        this.setState({ checked: isChecked, value: !isChecked ? FormatMoney(0) : FormatMoney(this.state.value) });
    }

    render() {
        return (
            <View style={styles.row}>
                <Prompt
                    title="Please enter item amount"
                    placeholder="0.00"
                    visible={this.state.promptVisible}
                    textInputProps={{keyboardType: 'decimal-pad', returnKeyType: 'done'}}
                    onCancel={() => this.setState({
                        promptVisible: false,
                        checked: false
                    })}
                    onSubmit={(value) => this.checkFormat(value) ? (this.setState({
                        promptVisible: false,
                        value: FormatMoney(value)
                    }), this.props.addToSubtotal(value)) : null}
                />
                <View style={{ width: '65%', justifyContent: 'center' }}>
                    <Checkbox
                        label={this.state.name}
                        value={this.state.name}
                        onCheck={this.handleCheck}
                        checked={this.state.checked}
                        disabled={this.state.checked}
                    />
                </View>
                <View style={{ width: '25%', justifyContent: 'center' }}>
                    <Text style={styles.textRight}>
                        ${this.state.value}
                    </Text>
                </View>
                <View style={{ width: '10%', justifyContent: 'center' }}>
                    <Text style={styles.textRight}>
                        <IconToggle
                            name="delete"
                            color="#F45B69"
                            size={25}
                            onPress={() => (this.props.removeItem(this.state.index), this.props.subtractTotal(this.state.value)) }
                        />
                    </Text>
                </View>
                <View style={styles.underLine}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        width: '100%',
        minHeight: 35,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    textRight: {
        textAlign: 'right'
    },
    underLine: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        width: '100%'
    }
});