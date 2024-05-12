import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

const MyComponent = () => {
    const handleEditClick = () => {
        console.log('Edit action clicked');
        // Add your edit action logic here
    };

    const handleDeleteClick = () => {
        console.log('Delete action clicked');
        // Add your delete action logic here
    };
    const trailingActions = () => (
        <TrailingActions>
            <SwipeAction destructive={true} onClick={handleDeleteClick}>
                Delete
            </SwipeAction>
        </TrailingActions>
    );
    const leadingActions = () => (
        <LeadingActions>
            <SwipeAction destructive={true} onClick={handleEditClick}>
                Edit
            </SwipeAction>
        </LeadingActions>
    );

    return (
        <>
            <SwipeableList
                fullSwipe={false}
                destructiveCallbackDelay={5000}
            >
                <SwipeableListItem
                    leadingActions={leadingActions()}
                    trailingActions={trailingActions()}
                >
                    Item content
                </SwipeableListItem>
            </SwipeableList>
        </>

    );
};

export default MyComponent;
