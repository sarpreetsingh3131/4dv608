import matplotlib.pyplot as plt
import io


class StatisticsService:

    def get_time_spent_statistics(self, events):
        properties = self.get_events_properties(events)
        keywords = []
        budgets = []

        for keyword in properties:
            keywords.append(keyword)
            budgets.append(properties[keyword])

        plt.figure()
        plt.pie(budgets, labels=keywords, autopct='%1.1f%%', shadow=True, startangle=90)
        plt.axis('equal')
        return self.get_bytes_image(plt)

    def get_used_remaining_budget_statistics(self, past_events, future_events):
        past_events_properties = self.get_events_properties(past_events)
        future_events_properties = self.get_events_properties(future_events)
        used_budget = []
        remaining_budget = []
        keywords = []

        for keyword in past_events_properties:
            if keyword in future_events_properties:
                used_budget.append(past_events_properties[keyword])
                remaining_budget.append(future_events_properties[keyword])

            else:
                used_budget.append(past_events_properties[keyword])
                remaining_budget.append(0)

            keywords.append(keyword)

        for keyword in future_events_properties:
            if keyword not in keywords:
                used_budget.append(0)
                remaining_budget.append(future_events_properties[keyword])
                keywords.append(keyword)

        plt.figure()
        width = 0.1
        plt.bar(range(len(used_budget)), used_budget, width=width, label='Used')
        plt.bar(range(len(remaining_budget)), remaining_budget, width=width, bottom=used_budget, label='Remaining')
        plt.xticks(range(len(keywords)), keywords)
        plt.ylabel('Budget (Hours)')
        plt.ylim(top=max(used_budget + remaining_budget) + 100)
        plt.legend()
        return self.get_bytes_image(plt)

    def get_bytes_image(self, plt):
        bytes_image = io.BytesIO()
        plt.savefig(bytes_image, format='png')
        bytes_image.seek(0)
        return bytes_image

    def get_events_properties(self, events):
        properties = {}

        for event in events:
            property = None

            try:
                property = {
                    'keyword': event['extendedProperties']['private']['keyword'],
                    'budget': float(event['extendedProperties']['private']['budget'])
                }
            except Exception:
                property = None

            if property is not None:
                if property['keyword'] in properties:
                    properties[property['keyword']] += property['budget']

                else:
                    properties[property['keyword']] = property['budget']

        return properties
