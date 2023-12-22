import React, { useState } from "react";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import { ListItem } from "@rneui/themed";
import { COLORS } from "../../../constants/theme";

const AccordionItem = ({ question, response, index }) => {
	const [expanded, setExpanded] = useState(false);
	return (
		<ListItem.Accordion
			key={index}
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
			<ListItem key={index} bottomDivider>
				<ListItem.Content>
					<ListItem.Title>{response}</ListItem.Title>
				</ListItem.Content>
			</ListItem>
		</ListItem.Accordion>
	);
};

export default AccordionItem;
