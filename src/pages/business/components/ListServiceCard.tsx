interface IProps {
    serviceName: string;
    price: number;
    description: string;
    currency: string;
    openTime: string;
    closeTime: string;
    daysOpen: string[];
}

export default function ListServiceCard(props: IProps) {
    return (
        <div className="flex flex-col pr-4 pl-4 bg-white pt-2 pb-2">
            <div className="flex justify-between">
                <div style={{ fontSize: "14px" }} className="font-semibold">
                    {props.serviceName}
                </div>
                <div style={{ fontSize: "14px" }} className="font-semibold">
                    {props.currency} {props.price}
                </div>
            </div>
            <p style={{ fontSize: "12px" }}>{props.description}</p>
            <p style={{ fontSize: "12px" }}>
                {props.openTime} - {props.closeTime}
            </p>
            <p style={{ fontSize: "12px" }}>
                {props.daysOpen.map((item, index) => (
                    <span key={item}>
                        {item.substring(0, 3)}
                        {index === props.daysOpen.length - 2
                            ? " and "
                            : index == props.daysOpen.length - 1
                            ? " "
                            : ", "}
                    </span>
                ))}
            </p>
        </div>
    );
}
