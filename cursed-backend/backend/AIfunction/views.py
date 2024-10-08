from django.http import JsonResponse, HttpResponse
from tavily import TavilyClient
from firecrawl import FirecrawlApp
from openai import OpenAI
import concurrent.futures
import re
import os
from requests.exceptions import HTTPError


app = FirecrawlApp(os.getenv("Fckey"))
client = OpenAI()
tavily_client = TavilyClient(os.getenv("tavilykey"))


def responding(markdown, url):
    respo = client.chat.completions.create(model="gpt-4o-mini",
                                           messages=[
                                               {"role": "system",
                                                "content": "You are going to be provided with scraped webpage urls and markdowns, mainly from shopping sites offering a list of items. From these markdowns, extract prices, titles of offered items, urls to offers and urls to the images of the offers. Bear in mind that urls for offers in markdowns may be partial, and have to be appended to the domain name of the shopping site. Provide answer in a table of Javascript objects format like [{'title':, 'image':, 'price':, 'url': }, {'title':, 'image':, 'price':, 'url': }, ...}]. Return any formatting improving readability. Markdowns may be cut abruptly to fit into max input limit. Provided markdowns may be from other sites or empty due to scraping errors, in which case you should ignore the input and return []. Do not add any additional commentary to your output, return just the table with JSONs"},
                                               {"role": "user", "content": "url: " + url + " | markdown: " + markdown}
                                           ]
                                           )
    return respo


def scrape_and_process_url(url):
    try:
        scrape_status = app.scrape_url(url, params={'formats': ["markdown"]})
    except HTTPError:
        return HttpResponse("Something went wrong with getting the offers, please try in a minute. If problem persists, contact RAPID ARCHITECTS :)")
    markdown = scrape_status['markdown'][:24000]
    return responding(markdown, url).choices[0].message.content


def AI_WebSearch(request):
    if not request.GET:
        return HttpResponse('No query found')
    elif request.GET.get('query', None):
        if len(request.GET.get('query', None)) < 5:
            return HttpResponse('Query too short')

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
                    print(exc)
                    continue

        for i in range(len(results)):
            try:
                results[i] = eval(re.sub(r'^```json\n|\n```$', '', results[i]).strip())
            except Exception as e:
                return HttpResponse(f"Something went wrong with one of the queries. Please ask Shoppy again! Error: {e}")
        output_table = results[0]
        for table in results[1:]:
            output_table.extend(table)
        return JsonResponse(output_table, safe=False)
    else:
        return HttpResponse("No 'query' parameter found")