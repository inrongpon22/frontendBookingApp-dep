
interface IProps {
    name: string;
    address: string;
    daysOpen: string[];
    phoneNumber: string;
}

export default function BusinessCard(props: IProps) {
    return (
        <div className="flex flex-col pr-4 pl-4">
            <div className='flex justify-between' >
                <div style={{ fontSize: "14px" }} className="font-semibold"> {props.name} </div>
                {/* <u style={{ fontSize: "12px" }}>Change</u> */}
            </div>
            <p style={{ fontSize: "12px" }}>{props.address}</p>
            <p style={{ fontSize: "12px" }}>
                {props.daysOpen.map((item, index) => (
                    <span key={item}>
                        {item.substring(0, 3)}
                        {index === props.daysOpen.length - 2 ? " and " : index == props.daysOpen.length - 1 ? " " : ", "}
                    </span>
                ))}
            </p>
            <p style={{ fontSize: "12px" }}>{props.phoneNumber}</p>
        </div>
    );
}
