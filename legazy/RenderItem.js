export default renderItem;
return (
    <View style={styles.itemContainer}>
        <TouchableOpacity
            style={{
                flex: 1,
                height: 50,
                backgroundColor: isActive ? 'blue' : 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: 1,
                borderColor: '#ddd',
            }}
            onLongPress={drag}
        >
            <Text>{item.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteItemByKey(item.key)}
        >
            <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
    </View>
);
