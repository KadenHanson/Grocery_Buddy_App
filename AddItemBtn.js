import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-material-ui';

export default class AddItemBtn extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPressMethod} style={styles.addTouch}>
                <View style={{ marginRight: 5 }}>
                    <Text>{this.props.buttonText}</Text>
                </View>
                <View>
                    <Icon
                        name="add-circle"
                        color="#89C440"
                        size={35}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    addTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 'auto',
        flexWrap: 'wrap',
        marginLeft: 10
    }
});