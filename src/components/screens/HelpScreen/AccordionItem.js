import React, { useState } from "react";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import { ListItem } from "@rneui/themed";
import { COLORS } from "../../../constants/theme";

const AccordionItem = ({ question, response }) => {
	const [expanded, setExpanded] = useState(false);
	return (
		<ListItem.Accordion
			content={
				<>
					<MaterialIcons
						name="question"
						size={30}
						color={COLORS.primary}
					/>
					<ListItem.Content>
						<ListItem.Title
							style={{
								marginLeft: 19,
								fontSize: 19,
							}}
						>
							{question}
						</ListItem.Title>
					</ListItem.Content>
				</>
			}
			isExpanded={expanded}
			onPress={() => {
				setExpanded(!expanded);
			}}
		>
			<ListItem bottomDivider topDivider>
				<ListItem.Content>
					<ListItem.Title>{response}</ListItem.Title>
				</ListItem.Content>
			</ListItem>
		</ListItem.Accordion>
	);
};

export default AccordionItem;
