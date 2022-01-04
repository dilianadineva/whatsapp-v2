import React from "react"
import { Circle } from "better-react-spinkit"

function Loading() {
	return (
		<center style={{ display: "grid", placeItems: "center", height: "100 vh" }}>
			<div>
				<img
					src="https://mcbconline.org/wp-content/uploads/2020/04/whatsapp-logo.png"
					alt="..."
					height={200}
					style={{ marginBottom: 10 }} //inline style
				/>
				<Circle color="green" size={60} />
			</div>
		</center>
	)
}

export default Loading
