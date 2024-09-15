import json

from django.http import JsonResponse, HttpResponse, HttpRequest
from tavily import TavilyClient
from firecrawl import FirecrawlApp
from openai import OpenAI
import concurrent.futures
import re
import os


app = FirecrawlApp(os.getenv("Fckey"))
client = OpenAI()
tavily_client = TavilyClient(os.getenv("tavilykey"))


def responding(markdown):
    respo = client.chat.completions.create(model="gpt-4o-mini",
                                           messages=[
                                               {"role": "system",
                                                "content": "You are going to be provided with scraped webpage urls and markdowns, mainly from shopping sites offering a list of items. From these markdowns, extract prices, titles of offered items, urls to offers and urls to the images of the offers. Bear in mind that urls for offers in markdowns may be partial, and have to be appended to the domain name of the shopping site. Provide answer in JSON format like {'item1':{'title':, 'image':, 'price':, 'url': }, 'item2'{'title':, 'image':, 'price':, 'url': } 'item3': ...}. Return any formatting improving readability. Markdowns may be cut abruptly to fit into max input limit. Provided markdowns may be from other sites or empty due to scraping errors, in which case you should ignore the input and return {}. Do not add any additional commentary to your output, return just the JSON"},
                                               {"role": "user", "content": markdown}
                                           ]
                                           )
    return respo


def scrape_and_process_url(url):
    scrape_status = app.scrape_url(url, params={'formats': ["markdown"]})
    markdown = scrape_status['markdown'][:24000]
    return responding(markdown).choices[0].message.content


def GIGAFUNCTION(request):
    if not request.GET:
        return HttpResponse('No query found')
    elif request.GET.get('query', None):
        response = tavily_client.search(request.GET.get('query', 'I want to buy a bicycle'))
        webpages = [result['url'] for result in response['results']]

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_url = {executor.submit(scrape_and_process_url, url): url for url in webpages}
            results = []
            for future in concurrent.futures.as_completed(future_to_url):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as exc:
                    print(f'URL generated an exception: {exc}')

        jsons = []
        for i in results:
            if i == '{}':
                continue
            else:
                cleaned_string = re.sub(r'^```json\n|\n```$', '', i).strip()
                jsonob = json.loads(cleaned_string)
                jsons.append(jsonob)

        merged = {}
        counter = 0
        for ob in jsons:
            for value in ob.values():
                counter += 1
                merged["name{}".format(counter)] = value
        return JsonResponse(data=merged)
    else:
        return HttpResponse("How did i get here?")